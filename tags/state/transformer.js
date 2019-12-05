const esprima = require("esprima");
const escodegen = require("escodegen");
const estraverse = require("estraverse");

function getValue(body) {
  let lValue = body.left && escodegen.generate(body.left);
  let argValue = body.argument && escodegen.generate(body.argument);
  let rValue = body.right && escodegen.generate(body.right);

  switch (body.operator) {
    case "++":
      return `++${argValue}`;
    case "--":
      return `--${argValue}`;
    case "+=":
      return `${lValue} + ${rValue}`;
    case "-=":
      return `${lValue} - ${rValue}`;
    default:
      return rValue;
  }
}

function replaceStateAssignments(ast, id) {
  let isChanged;
  const replace = estraverse.replace(ast, {
    enter: function(node) {
      if (
        node.type === "AssignmentExpression" ||
        node.type === "UpdateExpression"
      ) {
        if (
          (node.left && node.left.name === id) ||
          (node.argument && node.argument.name === id)
        ) {
          const value = getValue(node);
          const newScript = esprima.parseScript(
            `(component.setState("${id}", ${value}))`,
            { range: true }
          );
          isChanged = true;
          this.skip();
          return newScript.body[0].expression;
        }
      }
    }
  });
  return !isChanged ? null : ast;
}

function getNewMarkoAST(ast, id, builder, node) {
  const newAst = replaceStateAssignments(ast, id);
  if (newAst) {
    let newCode = escodegen.generate(newAst);
    if (newCode[newCode.length - 1] === ";") {
      newCode = newCode.slice(0, newCode.length - 1);
    }
    if (newCode[0] === "_") {
      newCode = newCode.slice(1);
    }
    // Wrap new expression in parenthesies to prevent any statement code like semicolins to cause it to fail
    if (node) {
      if (node.type === "Scriptlet") {
        return builder.scriptlet({ value: newCode });
      }
    }
    const newExpression = builder.expression(newCode);
    return newExpression;
  }
}

function lookFor(context, id) {
  const builder = context.builder;
  const walker = context.createWalker({
    enter(node) {
      if (node.type === "HtmlElement") {
        const properties = node.getProperties();

        if (properties) {
          Object.keys(properties).forEach(prop => {
            if (prop.indexOf("on") === 0) {
              const currentProp = properties[prop];
              currentProp.args = currentProp.args.map(arg => {
                if (arg.type === "Expression") {
                  const newAst = getNewMarkoAST(arg.ast, id, builder);
                  return newAst || arg;
                }
                return arg;
              });
            }
          });
        }
      } else if (node.type === "HtmlAttribute" && node.argument) {
        const newAst = getNewMarkoAST(
          esprima.parseScript(node.argument),
          id,
          builder
        );
        if (newAst) {
          node.argument = newAst.value;
        }
      } else if (node.type === "Expression" && !node.isDetached()) {
        const newAst = getNewMarkoAST(node.ast, id, builder);
        if (newAst) {
          node.replaceWith(newAst);
        }
      } else if (node.type === "Scriptlet") {
        if (node.tag) {
          // Old scriptlet
          context.addError({
            node,
            message:
              "Unsupported scriptlet found. Please change <% script %> to be $ script"
          });
        }
        // Parse scriptlet

        const parsedScript =
          typeof node.code === "string"
            ? esprima.parseScript(node.code)
            : node.code;
        const newAst = getNewMarkoAST(parsedScript, id, builder, node);
        if (newAst) {
          node.code = newAst.code;
        }
      }
    }
  });
  walker.walk(context.root);
}

module.exports = function codeGenerator(elNode, context) {
  const builder = context.builder;
  const params = elNode.params;
  const param = params[0] || {};
  let id;
  let init = "";
  // Assuming this is handeled by parser
  if (param.value) {
    const parsed = param.ast.body[0].expression;
    id = parsed.params[0].left.name;
    init = escodegen.generate(parsed.params[0].right);
  } else {
    id = param.name;
  }

  const stateAssign = builder.assignment("state", "state." + id, "&&");

  const rightAssignemnt = init
    ? builder.assignment(stateAssign, init, "||")
    : stateAssign;
  const variable = builder.vars([
    {
      id,
      init: rightAssignemnt
    }
  ]);

  // Find all event tags and replace param name with setState
  lookFor(context, id);
  elNode.replaceWith(variable);
};
