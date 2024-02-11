import React from "react";
import { Navigation } from "../components/navigation";
import { Header } from "../components/header";
import "../App.css";
function home() {
  return (
    <>
      <Navigation />
      <Header data={[]} />
    </>
  );
}

export default home;
