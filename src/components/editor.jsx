import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import { RxFontBold, RxFontItalic, RxCode, RxUnderline, RxCodesandboxLogo } from 'react-icons/rx'
import { RiStrikethrough } from 'react-icons/ri'
import { PiTextHOneBold, PiTextHTwoBold, PiTextHThreeBold } from 'react-icons/pi'
import { HiMiniChevronDown } from 'react-icons/hi2'
import { VscTextSize } from 'react-icons/vsc'
import { BsListOl, BsListUl, BsThreeDots } from 'react-icons/bs'
import { BubbleButton } from './BubbleButton.jsx';
import axiosClient from '../axios-client.js';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

export function Editor() {
  const [editorReady, setEditorReady] = useState(false);
  const { setNotification } = useStateContext();

  const [errors] = useState(null)
  const [loading, setLoading] = useState(false)

  const { id } = useParams();
  const [data, setData] = useState({
    id: null,
    name: '',
    setor: '',
    description: '',
    htmltext: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Underline,
      Heading,
      OrderedList,
      ListItem
    ],
    editorProps: {
      attributes: {
        class: 'text-editor__editor',
      },
    },
  });

  Heading.configure({
    levels: [1, 2, 3],
  });

  OrderedList.configure({
    itemTypeName: 'listItem',
  })

  const editorContent = useMemo(() => {
    if (editor) {
      setEditorReady(true);
    }
    if (editor && editor.commands) {
      editor.commands.setContent(data.htmltext);
    }
  }, [editor, data]);

  useEffect(() => {
    setLoading(true)
    if (id) {
      if (!data.htmltext) {
        axiosClient
          .get(`/workflows/${id}`)
          .then(({ data }) => {
            console.log(data);
            setData(data);
            setLoading(false)
          })
          .catch(() => {
          });
      }
    }
  }, [id, data.htmltext]);

  const handleSave = () => {
    if (editorReady) {
      if (editor && editor.commands) {
        axiosClient
          .put(`/workflows/${id}`, { htmltext: editor.getHTML(), name: data.name, setor: data.setor })
          .then(() => {
            setNotification('Texto atualizado com sucesso');
          })
          .catch(() => {
          });
      }
    }
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    toggleDropdown();
  };

  const handleButtonClick2 = (event) => {
    event.stopPropagation();
    toggleDropdown2();
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisible2, setIsDropdownVisible2] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleDropdown2 = () => {
    setIsDropdownVisible2(!isDropdownVisible2);
  };

  useEffect(() => {
    const closeDropdownOnOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("click", closeDropdownOnOutsideClick);
    };
  }, []);

  useEffect(() => {
    const closeDropdownOnOutsideClick = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener("click", closeDropdownOnOutsideClick);
    };
  }, []);

  return (
    <>
      {data.id && <h1>{data.name} - {data.setor}</h1>}
      <h2>{data.description}</h2>
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Carregando...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <div>
            <EditorContent key={editorContent} editor={editor} />
            { editor && (
            <BubbleMenu className='bubble-menu' editor={editor}>
              <BubbleButton onClick={handleButtonClick}>
                <VscTextSize/>
                <HiMiniChevronDown/>
              </BubbleButton>
              {isDropdownVisible && (
                <div className="bubble-dropdown-container" ref={dropdownRef}>
                  <div className="bubble-dropdown-content">
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                      <PiTextHOneBold/>
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                      <PiTextHTwoBold/>
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                      <PiTextHThreeBold/>
                    </BubbleButton>
                  </div>
                </div>
              )}
              <BubbleButton
                onClick={() => editor.chain().focus().toggleBold().run()}>
                <RxFontBold />
              </BubbleButton>
              <BubbleButton
                onClick={() => editor.chain().focus().toggleItalic().run()}>
                <RxFontItalic />
              </BubbleButton>
              <BubbleButton
                onClick={() => editor.chain().focus().toggleStrike().run()}>
                <RiStrikethrough />
              </BubbleButton>
              <BubbleButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <RxUnderline />
              </BubbleButton>
              <BubbleButton
                onClick={() => editor.chain().focus().toggleCode().run()}>
                <RxCode />
              </BubbleButton>
              <BubbleButton onClick={handleButtonClick2}>
                <BsThreeDots/>
              </BubbleButton>
              {isDropdownVisible2 && (
                <div className="bubble-dropdown-container" ref={dropdownRef2}>
                  <div className="bubble-dropdown-content">
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleOrderedList.run()}>
                      <BsListOl/>
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleBulletList.run()}>
                      <BsListUl/>
                    </BubbleButton>
                  </div>
                </div>
              )}
              <BubbleButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                <RxCodesandboxLogo />
              </BubbleButton>
            </BubbleMenu>
            )}
            <button className="btn" onClick={handleSave}>Salvar</button>
          </div>
        )}
      </div>
    </>
  );
}
