import { useState } from "react";
import { IconPicker } from "@/components/icon-picker";
import { IconRenderer } from "./components/icon-renderer";

export default function App() {
    const [icon, setIcon] = useState("");

    return (
        <div className="h-screen flex flex-col gap-4 items-center justify-center">
            <IconPicker value={icon} onChange={setIcon} />
            <p>
                Stored value: <code>{icon || "none"}</code>
            </p>
            {icon && (
                <p className="flex gap-2 items-center">
                    Icon renderer <IconRenderer icon={icon} />
                </p>
            )}
        </div>
    );
}
