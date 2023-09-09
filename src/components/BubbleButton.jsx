import PropTypes from "prop-types";

export function BubbleButton(props) {
  return (
    <button className="bubble-btn" {...props}>
      {props.children}
    </button>
  );
}

BubbleButton.propTypes = {
  children: PropTypes.node.isRequired,
};
