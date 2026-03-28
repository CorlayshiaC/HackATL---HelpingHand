import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Quiz } from "./pages/Quiz";
import { Dashboard } from "./pages/Dashboard";
import { Impact } from "./pages/Impact";
import { CreateCampaign } from "./pages/CreateCampaign";
import { CampaignDetails } from "./pages/CampaignDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
      { path: "quiz", Component: Quiz },
      { path: "dashboard", Component: Dashboard },
      { path: "impact", Component: Impact },
      { path: "create", Component: CreateCampaign },
      { path: "campaign/:id", Component: CampaignDetails },
    ],
  },
]);