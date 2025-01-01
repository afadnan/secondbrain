import { useState } from "react"
import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { CreateContentModal } from "./components/CreateContentModal"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"
import { Sidebar } from "./components/Sidebar"

function App() {
  const [modalOpen,setModalOpen] = useState(false);

  return (
    <div>
      <Sidebar />
    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-l-2">
    <CreateContentModal open={modalOpen} onClose={() => {
      setModalOpen(false);
    }} />
    
      <div className="flex justify-end gap-4">
        <Button onClick={() => {setModalOpen(true)}} variant="primary" text="Add Content" startIcon={<PlusIcon />}></Button>
        <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />}></Button>
      </div>
    <div className="flex gap-4">
      <Card type="twitter" link="https://x.com/cute_catse/status/1869782853237797325" title="First Tweet"/>
      <Card type="youtube" link="https://www.youtube.com/watch?v=z7Uv_A4bG-U" title="First YouTube Video"/>
    </div>
    </div>
    </div>
      )
}

export default App
