
import { useUIContext } from "../UIContext.tsx";
import { Tabbar } from "./Tabbar.tsx";

export const MainView = () => {
    const { isSidePanelOpen, openSidePanel, getCurrentModule } = useUIContext();
    return (
        <div>
            <Tabbar />
            {
                getCurrentModule()?.MainView({
                    isSidePanelOpen,
                    openSidePanel,
                })
            }
        </div>
)}