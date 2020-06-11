import React, { useState, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import classnames from "classnames";

import customImageInputStyle from "./customImageInputStyle";

const CustomeImageInput = (props) => {
  const fileUpload = useRef();
  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const { errorMessage, title, classes } = props;
  const { name, onBlur } = props.field;

  const showFileUpload = () => {
      if(fileUpload){
          fileUpload.current.click();
      }
  }

  const showPreloadImage = () => {
      let comp = null;

      if(errorMessage){
          comp = <Icon style={{ fontSize: 36 }}>error_outline</Icon>
      }else if(file){
          comp = (
              <img className={classes.avatarThumb} src={imagePreviewUrl} alt="" />
          );
      } else {
          comp = <Icon style={{ fontSize: 36, color: "#e65100"}}>image</Icon>
      }

      return comp;
  }

  const handleImageChange = (e) => {
      e.preventDefault();
      let reader = new FileReader();
      let uploadedFile = e.target.files[0];
      if(uploadedFile){
          reader.onloadend = () => {
              setFile(uploadedFile);
              setImagePreviewUrl(reader.result);
          }
          reader.readAsDataURL(uploadedFile);
          props.setFieldValue(props.field.name, uploadedFile);
      }
  }

  const avatarStyle = classnames(
      classes.bigAvatar,
      file ? [classes.whiteBack] : [classes.primaryBack],
      { [classes.errorBack] :errorMessage }
  );

  return (
    <div className={classes.container}>
      <input
        className={classes.hidden}
        id={name}
        name={name}
        type="file"
        onChange={handleImageChange}
        ref={fileUpload}
        onBlur={onBlur}
        accept=".jpg,.jpeg,.png,.gif"
      />

      <Typography className={classes.title} variant="h5">
          {title}
      </Typography>

      <Avatar className={avatarStyle} onClick={showFileUpload}>
        {showPreloadImage()}
      </Avatar>

      {errorMessage ? (
          <Typography className={classes.errorMsg} variant="caption" color="error">
              {errorMessage}
          </Typography>
      ) : null}
    </div>
  );
};

export default withStyles(customImageInputStyle)(CustomeImageInput);
