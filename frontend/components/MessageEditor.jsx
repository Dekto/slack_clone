import React from 'react';
import classNames from 'classnames';
import 'draft-js/dist/Draft.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { emojiConfig } from '../util/editorUtil';
import './MessageEditor.css';

class MessageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.emojiPlugin = createEmojiPlugin(emojiConfig);
    this.editor = React.createRef();
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    const { isNotConvoForm, readOnly } = this.props;

    if (!readOnly && isNotConvoForm) {
      setTimeout(() => this.focus(), 1);
    }

    if (!readOnly && !isNotConvoForm) {
      setTimeout(() => this.focus(), 1);
    }
  }

  componentDidUpdate(prevProps) {
    const { containerId, readOnly } = this.props;

    if (!prevProps.readOnly && !readOnly) {
      if (prevProps.containerId && prevProps.containerId !== containerId) {
        this.focus();
      }
    }

    if (prevProps.readOnly && !readOnly) {
      this.focus();
    }
  }

  focus() {
    this.editor.current.focus();
  }

  render() {
    const {
      readOnly,
      editorState,
      onChange,
      placeholder,
    } = this.props;
    const { EmojiSuggestions, EmojiSelect } = this.emojiPlugin;

    const plugins = [this.emojiPlugin];
    const hasReadOnly = readOnly || false;
    const editorClassNames = classNames('Editor', {
      Editor__locked: hasReadOnly,
      Editor__unlocked: !hasReadOnly,
    });

    return (
      <div role="presentation" className={editorClassNames} onClick={this.focus}>
        <Editor
          ref={this.editor}
          plugins={plugins}
          editorState={editorState}
          onChange={onChange}
          readOnly={hasReadOnly}
          placeholder={placeholder}
        />
        {readOnly || (<EmojiSuggestions />)}
        {readOnly || (<EmojiSelect />)}
      </div>
    );
  }
}

export default MessageEditor;
