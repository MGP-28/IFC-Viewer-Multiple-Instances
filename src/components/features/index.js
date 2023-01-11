import initializeNavbar from "./navbar";
import initializeSidebar from "./sidebar";

export default async function startFeatures() {
    initializeSidebar();
    initializeNavbar();
}