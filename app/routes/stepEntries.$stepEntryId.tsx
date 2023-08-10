import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteStepEntry, getStepEntry } from "~/models/stepEntry.server";
import { requireUserId } from "~/session.server";
import { dateFormatter, numberFormatter } from "~/utils";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.stepEntryId, "noteId not found");

  const stepEntry = await getStepEntry({ id: params.stepEntryId, userId });
  if (!stepEntry) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ stepEntry });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.stepEntryId, "step Id not found");

  await deleteStepEntry({ id: params.stepEntryId, userId });

  return redirect("/stepEntries");
};

export default function StepEntryDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">
        {dateFormatter.format(new Date(data.stepEntry.date))}
      </h3>
      <p className="py-6">{numberFormatter.format(data.stepEntry.numSteps)}</p>
      <hr className="my-4" />
      <Form method="post">
        <button type="submit" className="btn btn-destructive">
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
