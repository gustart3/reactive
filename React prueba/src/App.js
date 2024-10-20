import React, { useState, useEffect } from "react";
import "./App.css";
import image1 from "./imagenes/imagen1.png";
import image2 from "./imagenes/imagen2.png";
import image3 from "./imagenes/imagen3.png";
import image4 from "./imagenes/imagen4.png";
import image5 from "./imagenes/imagen5.png";
import image6 from "./imagenes/imagen6.png";

function App() {
  const [input, setInput] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem("likes");
    return storedLikes ? JSON.parse(storedLikes) : new Array(6).fill(0); // Cambia 6 por el número inicial de imágenes
  });
  const [comments, setComments] = useState(() => {
    const storedComments = localStorage.getItem("comments");
    return storedComments ? JSON.parse(storedComments) : new Array(6).fill([]);
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [images, setImages] = useState(() => {
    const storedImages = localStorage.getItem("images");
    return storedImages
      ? JSON.parse(storedImages)
      : [
          { src: image1, title: "AMOR", description: "Un emote enamorado" },
          { src: image2, title: "BURLA", description: "Un emote burlón" },
          { src: image3, title: "ENOJO", description: "Un emote enojado" },
          { src: image4, title: "LLANTO", description: "Un emote llorando" },
          { src: image5, title: "DIFRAZ", description: "Un emote disfrazado" },
          { src: image6, title: "RISA", description: "Un emote riendo" },
        ];
  });

  const [newImage, setNewImage] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Guardar datos en localStorage cada vez que se actualizan
  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
    localStorage.setItem("likes", JSON.stringify(likes));
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [images, likes, comments]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/mi-backend/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ inputValue: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResponseMessage(data.message);
        setInput("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLike = (index) => {
    const newLikes = [...likes];
    newLikes[index] = (newLikes[index] || 0) + 1;
    setLikes(newLikes);
  };

  const handleCommentSubmit = (e, index) => {
    e.preventDefault();
    const commentInput = e.target.elements.comment.value;
    if (commentInput.trim() !== "") {
      const newComments = [...comments];
      if (!newComments[index]) {
        newComments[index] = [];
      }
      newComments[index].push(commentInput);
      setComments(newComments);
      e.target.reset();
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImageIndex]);

  const handleNewImageSubmit = (e) => {
    e.preventDefault();
    if (newImage && newTitle && newDescription) {
      const newImageObj = {
        src: URL.createObjectURL(newImage),
        title: newTitle,
        description: newDescription,
      };
      setImages((prevImages) => [...prevImages, newImageObj]);
      setLikes((prevLikes) => [...prevLikes, 0]); // Agrega un nuevo contador de likes
      setComments((prevComments) => [...prevComments, []]); // Agrega un nuevo arreglo de comentarios
      setNewImage(null);
      setNewTitle("");
      setNewDescription("");
    }
  };

  return (
    <div className="app">
      <header>
        <nav>
          <h1>Mi primer sitio con REACT</h1>
          <ul>
            <li>
              <a href="#">Inicio</a>
            </li>
            <li>
              <a href="#">Explorar</a>
            </li>
            <li>
              <a href="#">Mis Publicaciones</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="input-section">
          <h2>Enviar Mensaje a Gus</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Escribe algo..."
            />
            <button type="submit">Enviar</button>
          </form>
          {responseMessage && <p>Respuesta del servidor: {responseMessage}</p>}
        </section>
        <section
          className={`gallery ${selectedImageIndex !== null ? "blur" : ""}`}
        >
          <h2>Galería de Publicaciones</h2>
          <div className="grid">
            {images.map((image, index) => (
              <div className="card" key={index}>
                <img
                  src={image.src}
                  alt={`emote ${index + 1}`}
                  onClick={() => handleImageClick(index)}
                />
                <h3>{image.title}</h3>
                <p>{image.description}</p>
                <button onClick={() => handleLike(index)}>Me gusta</button>
                <p>Me gusta: {likes[index] !== undefined ? likes[index] : 0}</p>
                <p>
                  Comentarios: {comments[index] ? comments[index].length : 0}
                </p>
              </div>
            ))}
          </div>
        </section>
        {selectedImageIndex !== null && (
          <div className="modal" onClick={closeModal}>
            <div
              className="modal-content no-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <div className="modal-container">
                <div className="form-and-comments">
                  <h3>{images[selectedImageIndex].title}</h3>
                  <p>{images[selectedImageIndex].description}</p>
                  <p>
                    Me gusta:{" "}
                    {likes[selectedImageIndex] !== undefined
                      ? likes[selectedImageIndex]
                      : 0}
                  </p>

                  <form
                    onSubmit={(e) => handleCommentSubmit(e, selectedImageIndex)}
                  >
                    <input
                      type="text"
                      name="comment"
                      placeholder="Escribe un comentario..."
                    />
                    <button type="submit">Comentar</button>
                  </form>
                  <div className="comments-container">
                    {comments[selectedImageIndex]?.map((comment, idx) => (
                      <div className="comment-bubble" key={idx}>
                        {comment}
                      </div>
                    )) || null}
                  </div>
                </div>
                <img
                  src={images[selectedImageIndex].src}
                  alt={`emote ${selectedImageIndex + 1}`}
                  style={{ maxWidth: "50%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Nueva sección para subir imágenes */}
        <section className="upload-section">
          <h2>Subir Nueva Imagen</h2>
          <form onSubmit={handleNewImageSubmit}>
            <input
              type="file"
              accept="image/png"
              onChange={(e) => setNewImage(e.target.files[0])}
              required
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título"
              required
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descripción"
              required
            />
            <button type="submit">Subir Imagen</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
