import { Spinner } from "@material-tailwind/react";

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <Spinner className="h-12 w-12" />
    </div>
  );
};

export default Loader;
