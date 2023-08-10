import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No step entry selected.
      <br /> Select a step entry on the left, or{" "}
      <Link to="new" className="text-violet-500 underline">
        create a new step entry.
      </Link>
    </p>
  );
}
