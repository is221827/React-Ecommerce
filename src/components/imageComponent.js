import React from "react";
export default class ImageComponent extends React.Component {
  state = { isOpen: false };

  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
    console.log("cliked");
  };

  render() {
    return (
      <div>
        <img
          className="small"
          src={this.props.src}
          onClick={this.handleShowDialog}
          alt={this.props.alt}
        />
        {this.state.isOpen && (
          <dialog
            className="dialog"
            style={{ position: "absolute" }}
            open
            onClick={this.handleShowDialog}
          >
            <img
              className="image"
              src={this.props.src}
              onClick={this.handleShowDialog}
              alt={this.props.alt}
            />
          </dialog>
        )}
      </div>
    );
  }
}
