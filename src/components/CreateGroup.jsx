import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Avatar, Grid, TextField } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import { resizeFile } from "../utils";
import db, { storage } from "../Firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  rootForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  previewAvatar: {
    width: theme.spacing(22),
    height: theme.spacing(22),
    marginBottom: theme.spacing(3),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  DialogBody: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  photoSelector: {
    width: theme.spacing(22),
    height: theme.spacing(22),
    margin: "auto",
    borderRadius: "50%",
    backgroundColor: "lightgrey",
    display: "grid",
    placeContent: "center",
    color: "white",
    cursor: "pointer",
    opacity: ".6",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateGroup({ open, handleClose }) {
  const classes = useStyles();
  const FileInputEl = useRef(null);
  const [file, setFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [resizedFile, setResizedFile] = useState(null);
  const [{ user }] = useStateValue();
  const [progress, setProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (file) {
      const getfileArrayPromises = async () => {
        const image = await resizeFile(file).then((file) => {
          return file;
        });
        return image;
      };

      getfileArrayPromises()
        .then((fileUri) => {
          setResizedFile(fileUri);
        })
        .catch((err) => {
          alert("Something went wrong while adding your image");
        });
    }
  }, [file]);

  const handleImageUpload = (docId) => {
    // put the image in storage bucket and create a variable to track its progress "uploadTask"
    const uploadTask = storage
      .ref(`/roomPictures/${docId}/roomDPs/${file?.name}`)
      .putString(resizedFile, "data_url", { contentType: "image/jpeg" });

    // track uploading
    uploadTask.on(
      "state_changed",
      // ui progress logic on upload state changed /
      (snapshot) => {
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },

      // error handling
      (err) => {
        console.log(err.message);
        return false;
      },

      // callback after the completion of upload
      () => {
        storage
          .ref(`/roomPictures/${docId}/roomDPs`)
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("rooms")
              .doc(docId)
              .update({
                roomDP: {
                  url,
                  ref: `/roomPictures/${docId}/roomDPs/${file.name}`,
                },
              })
              .then((res) => {
                handleClose();
                setGroupName("");
                setResizedFile("");
                setFile("");
                setIsUploading(false);
                alert("Group Created Successfully");
              })
              .catch((err) => {
                console.log(err);
                alert("Something went wrong ");
                return;
              });
          })
          .catch((err) => {
            console.log(err);
            alert("Something went wrong ");
          });
      }
    );
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName) {
      alert("Please add a group name");
      return;
    }
    setIsUploading(true);
    db.collection("rooms")
      .add({
        RoomName: groupName,
        admin: user.uid,
        createdDate: firebase.firestore.Timestamp.now(),
        lastUpdated: firebase.firestore.Timestamp.now(),
      })
      .then((data) => {
        if (resizedFile) {
          handleImageUpload(data.id);
        } else {
          alert("Group created successfully");
          setIsUploading(false);
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong while creating group");
      });
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Create Your Group
            </Typography>
            <Button
              disabled={isUploading}
              autoFocus
              color="inherit"
              onClick={handleClose}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.DialogBody}>
          <div>
            {!resizedFile ? (
              <Grid
                style={{
                  textAlign: "center",
                }}
                item
                xs={12}
                md={6}
              >
                <input
                  ref={FileInputEl}
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <div
                  onClick={() => FileInputEl?.current?.click()}
                  className={classes.photoSelector}
                >
                  <CameraAltIcon />
                </div>
                <Typography variant="subtitle1">Select a picture</Typography>
              </Grid>
            ) : (
              <Avatar className={classes.previewAvatar} src={resizedFile} />
            )}
            <form onSubmit={handleCreateGroup}>
              <Grid className={classes.rootForm} item xs={12} md={12}>
                <TextField
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                  variant="outlined"
                  label="Group Name"
                  color="primary"
                  margin="normal"
                />
                <Button
                  disabled={isUploading}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isUploading ? "Uploading" : "create Group"}
                </Button>
              </Grid>
            </form>
          </div>
        </Grid>
      </Dialog>
    </div>
  );
}
