export function Input({ type = "text", ...props }) {
    return (
      <input
        type={type}
        className="w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    );
  }
  