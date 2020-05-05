import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "utils/request";
import { UserContext } from "./UserProvider";
import config from "../config.json";
import { WideButton } from "./shared/Buttons";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

class ImageUploader extends Component {
  state = { selectedFile: null };

  handleFileSelect = e => {
    const imageFile = e.target.files[0];
    this.setState({ selectedFile: imageFile });
    const formData = new FormData();
    formData.append("file", imageFile, imageFile.name);
    const url = `${backendUrl}${this.props.url}`;
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        console.log("Image res =", res);

        // At this point, image is already uploaded to the cloud and inserted into DB
        const newImageUrl = res.data.url;
        this.props.onCompletion(newImageUrl);
      })
      .catch(err => {
        console.error(err.response);
      });
  };

  handleClick = () => this.selectFile.click();

  render() {
    return (
      <>
        <input
          type="file"
          onChange={this.handleFileSelect}
          ref={element => {
            this.selectFile = element;
          }}
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
        />
        <WideButton type="button" onClick={this.handleClick}>
          Upload new picture
        </WideButton>
      </>
    );
  }
}

ImageUploader.contextType = UserContext;

export default ImageUploader;

ImageUploader.propTypes = {
  url: PropTypes.string.isRequired,
  onCompletion: PropTypes.func
};
