import { useEffect, useState } from "react";
import axios from "axios";

export const Navigation = (props) => {
  const [menuData, setMenuData] = useState();
  useEffect(() => {
    try {
      axios
        .get(process.env.REACT_APP_BASE + "header")
        .then((response) => {
          setMenuData(response.data);
        })
        .catch((error) => {
          alert("Error in fetching menu data");
        });
    } catch (error) {
      alert("Error in fetching menu data");
    }
  }, []);

  const createMenu = (item) => {
    let theName = item.name + " " + (item.isParent ? " »" : "");
    return (
      <li>
        <a href="#features" className="page-scroll">
          {theName}
        </a>
        <ul>
          {item.hasChildren.map((child) => {
            return createMenu(child);
          })}
        </ul>
      </li>
    );
  };
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand page-scroll" href="#page-top">
            Hodox
          </a>{" "}
        </div>

        <div className="">
          <ul
            className=""
            id="nav"
            style={{
              backgroundColor: "black",
            }}
          >
            {menuData?.map((item) => {
              let theName = item.name + " " + (item.isParent ? " »" : "");
              return (
                <li>
                  <a href="#features" className="page-scroll">
                    {theName}
                  </a>
                  <ul>
                    {item.hasChildren.map((child) => {
                      return createMenu(child);
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
