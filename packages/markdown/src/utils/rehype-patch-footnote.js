export default () => (ast) => {
  const footNode = ast.children.find((n) => n.properties?.dataFootnotes);
  if (footNode) footNode.children[0].tagName = "h1";
};
