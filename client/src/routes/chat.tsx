import { useParams } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();
  return <div className="p-4 w-full ">
    <div className="rounded-md w-full h-full border border-white/10">
    New Chat: {id}
    </div>
  </div>;
}
