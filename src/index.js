import React from "react";
import ReactDOM from "react-dom";
import marked from "marked";
import "./index.css";

const assets = {
    editorHeader: "Code Editor",
    previewHeader: "Preview",
    codeIcon: "fa fa-code",
    pageIcon: "fa fa-file-code-o",
    arrowMaximizeIcon: "fa fa-arrows-alt",
    arrowCompressIcon: "fa fa-compress"
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: placeHolderMarkdown,
            previewMaximized: false,
            editorMaximized: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handlePreviewMax = this.handlePreviewMax.bind(this);
        this.handleEditorMax = this.handleEditorMax.bind(this);
    }
    handleChange(event) {
        this.setState({
            markdown: event.target.value
        });
    }
    handlePreviewMax() {
        this.setState({
            previewMaximized: !this.state.previewMaximized
        });
    }
    handleEditorMax() {
        this.setState({
            editorMaximized: !this.state.editorMaximized
        });
    }
    componentDidMount() {
        if (this.state.editorMaximized === false) {
            document.getElementById("maximize-editor").addEventListener("click", () => {
                this.handleEditorMax();
                document.getElementsByClassName("toolbar")[0].classList.toggle("large-window");
                document.getElementById("editor").classList.toggle("large-window");
                document.getElementById("editor").classList.toggle("cover-window");
                document.getElementById("preview").classList.toggle("hidden");
                document.getElementsByClassName("toolbar preview")[0].classList.toggle("hidden");
                console.log(`Editor maximized: ${this.state.editorMaximized}`);
            });
        }
        if (this.state.previewMaximized === false && this.state.editorMaximized === false) {
            document.getElementById("maximize-preview").addEventListener("click", () => {
                this.handlePreviewMax();
                document.getElementsByClassName("toolbar preview")[0].classList.toggle("large-window");
                document.getElementById("preview").classList.toggle("large-window");
                document.getElementById("editor").classList.toggle("hidden");
                document.getElementsByClassName("toolbar")[0].classList.toggle("hidden");
                console.log(`Preview maximized: ${this.state.previewMaximized}`);
            });
        }
    }
    render() {
        return (
            <div className="main">
                <ToolBarComponent header={assets.editorHeader} icon={assets.codeIcon} maximizeIcon={assets.arrowMaximizeIcon} onClick={this.handleEditorMax} maximizeEdit={this.state.editorMaximized} />
                <EditorComponent onChange={this.handleChange} markdown={this.state.markdown} />
                <ToolBarComponent header={assets.previewHeader} icon={assets.pageIcon} maximizeIcon={assets.arrowMaximizeIcon} onClick={this.handlePreviewMax} maximizePrev={this.state.previewMaximized} />
                <PreviewComponent onChange={this.handleChange} markdown={this.state.markdown} />
            </div>
        )
    }
}

const ToolBarComponent = (props) => {
    if (props.header === "Code Editor") {
        const check = () => {
            return props.maximizeEdit ? assets.arrowCompressIcon : assets.arrowMaximizeIcon;
        }
        return (
            <div className="toolbar">
                <div>
                    <i className={props.icon} aria-hidden="false"></i>
                    <p>{props.header}</p>
                </div>
                <div>
                    <i className={check()} id="maximize-editor" onClick={props.handleEditorMax}></i>
                </div>
            </div>
        )
    } else {
        const checkPreview = () => {
            return props.maximizePrev ? assets.arrowCompressIcon : assets.arrowMaximizeIcon;
        }
        return (
            <div className="toolbar preview">
                <div>
                    <i className={props.icon} aria-hidden="false"></i>
                    <p>{props.header}</p>
                </div>
                <div>
                    <i className={checkPreview()} id="maximize-preview" onClick={props.handlePreviewMax}></i>
                </div>
            </div>
        )
    }
}

const EditorComponent = (props) => {
    return (
        <div className="editor-component">
            <textarea type="text" id="editor" value={props.markdown} onChange={props.onChange}></textarea>
        </div>
    )
}

const PreviewComponent = (props) => {
    const parseMarkdown = () => {
        return {
            __html: marked(props.markdown, {renderer: markedRenderer})
        }
    }
    return (
        <div className="preview-component" type="text" id="preview" dangerouslySetInnerHTML={parseMarkdown()} onChange={props.handleChange}></div> 
    )
}

const markedRenderer = new marked.Renderer();
markedRenderer.link = (href, title, text) => {
    return `<a href=${href} target="_blank">${text}</a>`;
};

// Handling carriage returns as a line break <br>
marked.setOptions({
    breaks: true,
});

// Placeholder state markdown in editor
const placeHolderMarkdown = `
# Welcome to my Markdown Previewer built with React!

## This is a sub heading...

### This is a bit smaller heading...

#### Smallest heading

To create a hyperlink in GFM (Github Flavored Markdown): 
[My portfolio]("https://tannerdolby.netlify.app")

To write single line code snippets, wrap your code in backticks like this:

\`<p>Hello World</p>\`

For multi-line code blocks wrap the statements in three opening and closing backticks.

\`\`\`
// Use the above opening three backticks to start a multi-line code statement

let incrementValue = (val) => {
    return val += 1
}

incrementValue(5);
\`\`\`

To make text bold use **text** (wrap the text inside double asterisks)

To make text italicized use _text_ (wrap the text inside single underscores)

For both bold + italic use **_text_**

> Block Quotes start with the > symbol!

Bulleted Lists (With asterisks):
* List item 1
* List item 2

Bulleted Lists (With dashes):
- List item 1
- List item 2

Numbered Lists:
1. List item 1
2. List item 2

Carriage Return:
Hitting the enter/return key will create a line break element \`<br>\`

Embedded Images:
![React Logo](https://user-images.githubusercontent.com/48612525/84835675-f3749a00-afe8-11ea-8ac4-90a047e81ac2.png)
`
ReactDOM.render(<AppComponent />, document.getElementById("root"));