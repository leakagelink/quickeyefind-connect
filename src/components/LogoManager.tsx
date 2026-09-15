import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImageUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppLogo } from "@/components/AppLogo";
import { setAppLogo } from "@/lib/branding.functions";

const MAX_BYTES = 1_000_000; // ~1 MB source file

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image"));
    reader.readAsDataURL(file);
  });
}

/** Admin-only control that replaces the app logo everywhere. */
export function LogoManager() {
  const currentLogo = useAppLogo();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const save = useServerFn(setAppLogo);

  const mutation = useMutation({
    mutationFn: (logoUrl: string | null) => save({ data: { logoUrl } }),
    onSuccess: (_res, logoUrl) => {
      queryClient.invalidateQueries({ queryKey: ["branding"] });
      setMessage(logoUrl ? "Logo updated everywhere in the app." : "Default logo restored.");
    },
    onError: (err: Error) => setMessage(err.message || "Could not update the logo."),
  });

  async function onPick(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) {
      setMessage("Please choose a PNG, JPG, WEBP or SVG image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage("Image is too large — please use a file under 1 MB.");
      return;
    }
    const dataUrl = await readAsDataUrl(file);
    mutation.mutate(dataUrl);
  }

  return (
    <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ImageUp className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h2 className="text-sm font-semibold">App Logo</h2>
          <p className="text-xs text-muted-foreground">
            Change the logo shown on splash, login and map screens.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted/40 p-2">
          <img src={currentLogo} alt="Current app logo" className="max-h-full max-w-full" />
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => void onPick(e.target.files?.[0])}
          />
          <Button
            type="button"
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => inputRef.current?.click()}
          >
            {mutation.isPending ? "Uploading…" : "Upload new logo"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(null)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to default
          </Button>
        </div>
      </div>

      {message && <p className="mt-3 text-xs text-muted-foreground">{message}</p>}
    </section>
  );
}
