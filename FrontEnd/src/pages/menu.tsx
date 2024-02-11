import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FieldSettingsModel,
  FieldsSettingsModel,
  TreeViewComponent,
} from "@syncfusion/ej2-react-navigations";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { AlertType, NetworkStatus } from "../types/case.types";
var isActive = true;
let treeView: TreeViewComponent = new TreeViewComponent({});
let theWarningContent = "";
let currentNode: any = undefined;
function Menu() {
  const [treeViewField, setTreeViewField] = useState<FieldsSettingsModel>({
    child: "hasChildren",
    id: "_id",
    text: "name",
    parentID: "pid",
    dataSource: [],
    hasChildren: "isParent",
    expanded: "expanded",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [itemValue, setItemValue] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState<NetworkStatus>({
    status: (
      <div className="alert alert-info" role="alert">
        Please wait...
      </div>
    ),
  });
  const navigate = useNavigate();
  const getTreeViewData = () => {
    try {
      axios.get(process.env.REACT_APP_BASE + "header").then((response) => {
        setTreeViewField({ ...treeViewField, dataSource: response.data });
      });
    } catch (error) {
      triggerWarnings("error", "Error. Check your internet connection.");
    }
  };
  useEffect(() => {
    getTreeViewData();
    $(".js-fullheight").css("height", window.innerHeight);
    $(window).resize(function () {
      $(".js-fullheight").css("height", window.innerHeight);
    });

    $("#sidebarCollapse").on("click", function () {
      if (isActive) {
        $("#sidebar").removeClass("active");
      } else {
        $("#sidebar").addClass("active");
      }
      isActive = !isActive;
    });
    return () => {};
  }, []);
  const prepareData = (data: any, pid: string, totalData: Array<any>) => {
    data.forEach((element: any) => {
      totalData.push({
        ...element,
        pid: pid,
        isParent: element.hasChildren.length > 0 ? true : false,
        hasChildren: prepareData(element.hasChildren, element._id, totalData),
      });
    });
  };
  const onDrop = (args: any) => {
    let theData = treeView.getTreeData();
    let thePureData: any = [];
    theData.forEach((element: any) => {
      prepareData(element.hasChildren, element._id, thePureData);
      thePureData.push({
        ...element,
        pid: null,
        isParent: element.hasChildren.length > 0 ? true : false,
      });
    });
    try {
      axios
        .patch(process.env.REACT_APP_BASE + "header/reorder", thePureData)
        .then((response) => {
          triggerWarnings("success", "Data updated successfully.");
          getTreeViewData();
        });
    } catch (error) {
      triggerWarnings("error", "Error. Check your internet connection.");
    }
  };
  const triggerWarnings = (type: AlertType, content: string) => {
    setShowStatus(true);
    setTimeout(() => {
      setShowStatus(false);
    }, 5000);
    setStatus({
      status: (
        <div className={`alert alert-${type}`} role="alert">
          {content}
        </div>
      ),
    });
  };
  const nodeEdited = (args: any) => {
    try {
      axios
        .patch(process.env.REACT_APP_BASE + "header/" + args.nodeData.id, {
          name: args.newText,
          pid: args.nodeData.parentID,
          isParent: args.nodeData.hasChildren,
        })
        .then((response) => {
          triggerWarnings("success", "Data updated successfully.");
          getTreeViewData();
        });
    } catch (error) {
      triggerWarnings("error", "Error. Check your internet connection.");
    }
  };
  const onNodeDeleted = (args: any) => {
    setIsOpen(false);
    try {
      axios
        .delete(process.env.REACT_APP_BASE + "header/" + currentNode.id)
        .then((response) => {
          treeView.removeNodes([currentNode.id]);
          theWarningContent = "Record deleted successfully.";
          currentNode = undefined;
          setIsWarning(true);
          triggerWarnings("success", "Record deleted successfully.");
        });
    } catch (error) {
      triggerWarnings("error", "Error. Check your internet connection.");
    }
  };
  const onAdd = () => {
    if (!itemValue) {
      theWarningContent = "Please enter a value.";
      setIsWarning(true);
      return;
    }
    try {
      axios
        .post(process.env.REACT_APP_BASE + "header", {
          name: itemValue,
          pid: null,
          isParent: false,
        })
        .then((response) => {
          triggerWarnings("success", "Record added successfully.");
          getTreeViewData();
          setIsAdd(false);
        });
    } catch (error) {
      triggerWarnings("error", "Error. Check your internet connection.");
    }
  };
  return (
    <div>
      <div className="wrapper d-flex align-items-stretch">
        <div id="content" className="p-4 p-md-5">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <button
                className="btn btn-dark d-inline-block d-lg-none ml-auto"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="fa fa-bars"></i>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="nav navbar-nav ml-auto">
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => navigate("/")}>
                      Home
                    </a>
                  </li>
                  <li className="nav-item active">
                    <a className="nav-link" href="#">
                      Menu Manager
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container" style={{}}>
            <h2 className="mb-4">Menu Manager</h2>
            <button className="btn btn-primary" onClick={() => setIsAdd(true)}>
              Add Menu
            </button>
            <button
              className="btn btn-danger"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                if (!currentNode) {
                  theWarningContent = "Please select a record to delete.";
                  setIsWarning(true);
                } else {
                  setIsOpen(true);
                }
              }}
            >
              Delete
            </button>
            <TreeViewComponent
              ref={(tree: TreeViewComponent) => (treeView = tree)}
              id="tree1"
              fields={treeViewField}
              nodeDropped={onDrop}
              dataBound={() => {
                treeView && treeView.expandAll();
              }}
              allowDragAndDrop={true}
              allowEditing={true}
              nodeEdited={nodeEdited}
              nodeSelected={(args) => (currentNode = args.nodeData)}
              style={{ marginTop: "20px" }}
            />
            <Modal show={isOpen}>
              <Modal.Header closeButton>
                <Modal.Title>Attention</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure? This record will be deleted if you procced.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={onNodeDeleted}>
                  Yes
                </Button>
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  No
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={isWarning} onHide={() => setIsWarning(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Attention</Modal.Title>
              </Modal.Header>
              <Modal.Body>{theWarningContent}</Modal.Body>
              <Modal.Footer>
                <Button variant="" onClick={() => setIsWarning(false)}>
                  Done
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={isAdd} onHide={() => setIsAdd(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Menu Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Menu Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="menu"
                    value={itemValue}
                    onChange={(e: any) => setItemValue(e.target.value)}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={onAdd}>
                  Procced
                </Button>
                <Button variant="secondary" onClick={() => setIsAdd(false)}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
            {showStatus ? status.status : <></>}
            <div className={`alert alert-info`} role="alert">
              To edit a record, double-click on the record.
            </div>
            {treeViewField.dataSource &&
            Number((treeViewField.dataSource as any).length) === 0 ? (
              <div className="alert alert-info" role="alert">
                No data to show. Please add a record.
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
