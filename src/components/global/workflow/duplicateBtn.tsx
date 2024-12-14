export default function DuplicateBtn({
  workflowName,
}: {
  workflowName: String;
}) {
  const handler = async () => {
    return null;
  };
  return <span onClick={handler}>Duplicate Workflow</span>;
}
