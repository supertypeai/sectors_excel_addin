import { useState, useCallback, useEffect } from "react";
import { callServer } from "../call-server";
import { TypographySmall } from "./typography/header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Trash2 } from "lucide-react";

export default function ApiKeySection() {
  const [key, setKey] = useState("");
  const [keyPreview, setKeyPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: "ok" | "err" | null;
    msg: string;
  }>({ type: null, msg: "" });
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    callServer<string | null>("getApiKeyPreview").then(setKeyPreview).catch(() => { });
  }, []);

  const handleSave = useCallback(async () => {
    if (!key.trim()) {
      setStatus({ type: "err", msg: "API Key cannot be empty!" });
      return;
    }
    try {
      await callServer("saveApiKey", key.trim());
      setStatus({ type: "ok", msg: "API Key saved successfully." });
      setKey("");
      const preview = await callServer<string | null>("getApiKeyPreview");
      setKeyPreview(preview);
    } catch (e) {
      setStatus({ type: "err", msg: String(e) });
    }
  }, [key]);

  const handleDelete = useCallback(async () => {
    try {
      await callServer("deleteApiKey");
      setKeyPreview(null);
      setStatus({ type: "ok", msg: "API Key deleted." });
    } catch (e) {
      setStatus({ type: "err", msg: String(e) });
    }
  }, []);

  const handleTest = useCallback(async () => {
    setTesting(true);
    setStatus({ type: null, msg: "" });
    try {
      await callServer("testConnection");
      setStatus({ type: "ok", msg: "Connected successfully!" });
    } catch (e) {
      setStatus({ type: "err", msg: String(e) });
    } finally {
      setTesting(false);
    }
  }, []);

  return (
    <div className="space-y-3 p-4">
      <label className="block text-sm font-medium text-foreground">
        Sectors API Key
      </label>
      {keyPreview && (
        <div className="flex items-center justify-between gap-2">
          <TypographySmall className="text-muted-foreground truncate">
            Current key: <span className="font-mono">{keyPreview}</span>
          </TypographySmall>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-6 w-6 shrink-0" onClick={handleDelete}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove key</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      <Input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder={keyPreview ? "Enter a new key to replace" : "Enter your API key"}
      />
      <div className="flex gap-2">
        <Button variant="rose" onClick={handleSave}>
          Save Key
        </Button>
        <Button variant="outline" onClick={handleTest} disabled={testing}>
          {testing ? "Testing..." : "Test Connection"}
        </Button>
      </div>
      {status.type && (
        <TypographySmall
          className={status.type === "ok" ? "text-muted-foreground" : "text-destructive"}
        >
          {status.msg}
        </TypographySmall>
      )}
    </div>
  );
}
