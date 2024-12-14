export default function DuplicateWorkflow({ workflow }: { workflow: String }) {
  const handler = async () => {
    return null;
  };
  return <span onClick={handler}>Duplicate Workflow</span>;
}
