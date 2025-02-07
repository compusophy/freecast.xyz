import Div100vh from "react-div-100vh";

import EditorContainer from "../components/editor";
import TopBar from "../components/top-bar";

interface EditorLayoutProps {
  html: string;
  onSave: (html: string) => Promise<boolean>;
}

export function EditorLayout({ html, onSave }: EditorLayoutProps) {
  return (
    <Div100vh>
      <TopBar/>
      <EditorContainer html={html} onSave={onSave} />
    </Div100vh>
  );
}