import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { CreateContentModal } from "./components/CreateContentModal"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"
function App() {


  return (
    <div className="p-4">
    <CreateContentModal open={true} />
    
      <div className="flex justify-end gap-4">
        <Button variant="primary" text="Add Content" startIcon={<PlusIcon />}></Button>
        <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />}></Button>
      </div>
    <div className="flex gap-4">
      <Card type="twitter" link="https://x.com/cute_catse/status/1869782853237797325" title="First Tweet"/>
      <Card type="youtube" link="https://www.youtube.com/watch?v=z7Uv_A4bG-U" title="First YouTube Video"/>
    </div>
    </div>
      )
}

export default App
