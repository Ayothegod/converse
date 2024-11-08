
export default function App() {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  return (
    <div>app</div>
  )
}
