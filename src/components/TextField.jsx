import cn from 'classnames';
import React, { useState } from 'react';
import './text.css';

export default function TextField({
  placeholder,
  className,
  onFocus,
  onChange,
  onEnter,
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const changeValue = ev => {
    setValue(ev.target.value);
    onChange?.(ev.target.value);
  };
  const focus = () => {
    setFocused(true);
    onFocus?.();
  };
  const blur = () => {
    setFocused(false);
  };
  const pressEnter = ev => {
    if (ev.key === 'Enter' && !ev.nativeEvent.isComposing) {
      ev.preventDefault();
      onEnter?.(value);
    }
  };

  return (
    <input
      type="text"
      className={cn('text-input', className)}
      onChange={changeValue}
      onFocus={focus}
      onBlur={blur}
      onKeyDown={pressEnter}
      placeholder={placeholder || '텍스트를 입력해 주세요.'}
      value={value}
      style={
        focused ? { borderWidth: 2, borderColor: 'rgb(25, 118, 210)' } : null
      }
    />
  );
}
