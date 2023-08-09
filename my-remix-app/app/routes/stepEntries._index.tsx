import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No step entry selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new step entry.
      </Link>
    </p>
  );
}
