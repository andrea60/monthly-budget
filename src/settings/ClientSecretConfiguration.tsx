import { useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useSettings } from "./SettingsProvider";
export const ClientSecretConfiguration = () => {
  const [clientSecret, setClientSecret] = useState<string>();
  const { saveClientSecret } = useSettings();

  const isEmpty = !clientSecret || clientSecret.trim().length < 1;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientSecret) return;
    saveClientSecret(clientSecret);
  };
  return (
    <div className="card bg-base-200 shadow-lg w-full">
      <form className="card-body" onSubmit={handleSubmit}>
        <h5 className="card-title">✋ Hey, wait a second</h5>
        <div className="py-2 flex flex-col gap-5">
          <p>
            Your <span className="font-mono">client_secret</span> is missing.
            You need to set your Monzo API client secret before continuining
          </p>

          <textarea
            className="textarea textarea-bordered resize-y font-mono h-28"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          ></textarea>
        </div>
        <div className="card-actions justify-between">
          <button
            type="button"
            className="btn btn-primary btn-outline"
            onClick={async () => {
              const text = await navigator.clipboard.readText();
              setClientSecret(text);
            }}
          >
            <ClipboardIcon className="size-6" />
          </button>
          <button type="submit" className="btn btn-primary" disabled={isEmpty}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
