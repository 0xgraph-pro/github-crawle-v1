import { useEffect, useRef, useState } from "react";
import "./App.css";
import UserTable from "./components/UserTable";
import { Button } from '@heroui/react';
import { TextField, Input, Spinner } from '@heroui/react';
import {Label, NumberField} from "@heroui/react";

function App() {
  const workerRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [depth, setDepth] = useState(1);
  const [crawler_user, setCrawlerUser] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  useEffect(() => {
    workerRef.current = new Worker(new URL("./crawler.js", import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { flag, data } = event.data;
      if(flag == "data")  setUsers((users) => [...users, { id: users.length + 1, ...data }]);
      if(flag == "finished") { alert("Finished Crwaling!"); setIsWorking(false); }
    };
  }, []);

  return (
    <div className="my-4">
      <div className="flex">
        <TextField className="w-full max-w-64 mr-4" name="email">
          <Input placeholder="Enter Github User Name..." value={crawler_user} onChange={(e) => setCrawlerUser(e.target.value)} />
        </TextField>
        <NumberField className="w-full max-w-64 mr-4" value={depth} onChange={(e) => setDepth(setDepth(e))} minValue={1} name="width">
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input className="w-30" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>
        <Button
          onClick={() => {
            workerRef.current.postMessage({ crawler_user, depth, token: import.meta.env.VITE_GITHUB_TOKEN });
            setIsWorking(true);
          }}
          className="crawl-btn"
          isPending={isWorking}
        >
          {({isPending}) => (
            <>
              {isPending ? <><Spinner color="current" size="sm" />Crawling...</> : <>Start Crawler</>}
            </>
          )}
        </Button>
        <div className="mx-4">Found <p className="text-red-500 text-lg inline">{users.length}</p>Users</div>
      </div>
      <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <UserTable users={users} />
      </div>
      <footer className="footer">
        <span>© 2026 GitCrawler</span> <span className="footer__dot">•</span>
        <span>Built for GitHub exploration</span>
      </footer>
    </div>
  );
}

export default App;
