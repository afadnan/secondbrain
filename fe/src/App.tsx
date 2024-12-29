import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"
function App() {


  return (
    <div>
    <Button variant="primary" text="Add Content" startIcon={<PlusIcon />}></Button>
    <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />}></Button>
    <Card type="twitter" link="https://x.com/cute_catse/status/1869782853237797325" title="First Tweet"/>
    </div>
      )
}

export default App
