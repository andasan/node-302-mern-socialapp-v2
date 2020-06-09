import React, { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
        <div className="input-field col s12">
          <input
            id={props._id}
            type={props.type}
            className={`validate ${
              !inputState.isValid && inputState.isTouched && "invalid"
            }`}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
          />
        </div>
    ) : (
        <div className="input-field col s12">
          <textarea
            id={props._id}
            rows={props.row || 6}
            className={`materialize-textarea validate ${
              !inputState.isValid && inputState.isTouched && "invalid"
            }`}
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}
            placeholder=''
          />
        </div>
    );

  return (
    <div className="input-field col s12">
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
      <label className="active white-text" htmlFor={props._id}>
        {props.label}
      </label>
    </div>
  );
};

export default Input;
