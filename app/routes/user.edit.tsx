import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";

import { updateUserName } from "~/models/user.server";
import { requireUser, requireUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/stepEntries");

  if (typeof name !== "string" || name.length === 0) {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }

  const userId = await requireUserId(request);

  await updateUserName(userId, name);

  return redirect(redirectTo);
};

export const meta: V2_MetaFunction = () => [{ title: "Edit User" }];

export default function EditUser() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/stepEntries";
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                ref={nameRef}
                id="name"
                required
                autoFocus={true}
                value={loaderData.user.name ?? ""}
                name="name"
                autoComplete="name"
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-describedby="name-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.name ? (
                <div className="pt-1 text-red-700" id="name-error">
                  {actionData.errors.name}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex space-x-2">
            <Link to="/stepEntries" className="w-full btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="w-full btn btn-default">
              Save Name
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
