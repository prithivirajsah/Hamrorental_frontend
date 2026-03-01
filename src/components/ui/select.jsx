import React, { createContext, useContext } from 'react';

const SelectContext = createContext({
  value: '',
  onValueChange: undefined,
  options: [],
});

function extractOptions(children) {
  const options = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === SelectItem) {
      options.push({ value: child.props.value, label: child.props.children });
      return;
    }

    if (child.props?.children) {
      options.push(...extractOptions(child.props.children));
    }
  });

  return options;
}

export function Select({ value = '', onValueChange, children }) {
  const options = extractOptions(children);

  return (
    <SelectContext.Provider value={{ value, onValueChange, options }}>
      <div>{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef(function SelectTrigger(
  { className = '' },
  ref
) {
  const { value, onValueChange, options } = useContext(SelectContext);

  return (
    <select
      ref={ref}
      value={value ?? ''}
      onChange={(event) => onValueChange?.(event.target.value)}
      className={`w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${className}`.trim()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

export function SelectValue() {
  return null;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem() {
  return null;
}
