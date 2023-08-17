import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import {
  createStepEntry,
  getPreviousStepEntryDates,
} from "~/models/stepEntry.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const dateInput = formData.get("date") as unknown as Date;
  const numStepsInput = formData.get("numSteps");
  const linkToPhotoInput = formData.get("linkToPhoto");
  const previousStepEntryDates = await getPreviousStepEntryDates({
    userId,
  });
  const formattedPreviousStepEntryDates = previousStepEntryDates.map(
    (obj) => obj.date.toISOString().split("T")[0]
  );

  if (!dateInput) {
    return json(
      {
        errors: { numSteps: null, date: "Date is required", linkToPhoto: null },
      },
      { status: 400 }
    );
  }

  if (
    formattedPreviousStepEntryDates.includes(dateInput as unknown as string)
  ) {
    return json(
      {
        errors: {
          numSteps: null,
          date: "You've already added an entry for this date",
          linkToPhoto: null,
        },
      },
      { status: 400 }
    );
  }

  if (numStepsInput === null) {
    return json(
      {
        errors: {
          numSteps: "numSteps is required",
          date: null,
          linkToPhoto: null,
        },
      },
      { status: 400 }
    );
  }

  if (!linkToPhotoInput) {
    return json(
      {
        errors: {
          linkToPhoto: "a link to your evidence photo is required",
          date: null,
          numSteps: null,
        },
      },
      { status: 400 }
    );
  }

  const stepEntry = await createStepEntry({
    numSteps: Number(numStepsInput),
    date: new Date(dateInput),
    userId,
    linkToPhoto: linkToPhotoInput as string,
  });
  return redirect(`/stepEntries/${stepEntry.id}`);
};

export default function NewStepEntryPage() {
  const actionData = useActionData<typeof action>();
  const dateRef = useRef<HTMLInputElement>(null);
  const numStepsRef = useRef<HTMLInputElement>(null);
  const linkToPhotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.date) {
      dateRef.current?.focus();
    } else if (actionData?.errors?.numSteps) {
      numStepsRef.current?.focus();
    } else if (actionData?.errors?.linkToPhoto) {
      linkToPhotoRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={dateRef}
            name="date"
            type="date"
            min="2023-08-01"
            max="2023-08-31"
            className="flex-1 rounded-md border-2 border-gray-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.date ? true : undefined}
            aria-errormessage={
              actionData?.errors?.date ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.date ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.date}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Number of Steps: </span>
          <input
            ref={numStepsRef}
            type="number"
            name="numSteps"
            min="0"
            max="99999"
            className="w-full flex-1 rounded-md border-2 border-gray-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.numSteps ? true : undefined}
            aria-errormessage={
              actionData?.errors?.numSteps ? "body-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.numSteps ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.numSteps}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Evidence photo link: </span>
          <input
            ref={linkToPhotoRef}
            id="linkToPhoto"
            required
            autoFocus={true}
            name="linkToPhoto"
            autoComplete="linkToPhoto"
            aria-invalid={actionData?.errors?.linkToPhoto ? true : undefined}
            aria-describedby="linkToPhoto-error"
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
        </label>
        {actionData?.errors?.linkToPhoto ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.linkToPhoto}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button type="submit" className="btn btn-default">
          Save Step Entry
        </button>
      </div>
    </Form>
  );
}
