import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem("likes");
    return storedLikes ? JSON.parse(storedLikes) : new Array(6).fill(0);
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
          {
            src: `${process.env.PUBLIC_URL}/imagenes/imagen1.png`,
            title: "AMOR",
            description: "Un emote enamorado",
          },
          {
            src: `${process.env.PUBLIC_URL}/imagenes/imagen2.png`,
            title: "BURLA",
            description: "Un emote burlón",
          },
          {
            src: `${process.env.PUBLIC_URL}/imagenes/imagen3.png`,
            title: "ENOJO",
            description: "Un emote enojado",
          },
          {
            src: `${process.env.PUBLIC_URL}/imagenes/imagen4.png`,
            title: "LLANTO",
            description: "Un emote llorando",
          },
          {
            src: `${process.env.PUBLIC_URL}/imagenes/imagen5.png`,
            title: "DISFRAZ",
            description: "Un emote disfrazado",
          },
          {
            src: `${process.env.PUBLIC_URL}/imagenes/imagen6.png`,
            title: "RISA",
            description: "Un emote riendo",
          },
        ];
  });

  const [newImage, setNewImage] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      newComments[index] = [...(newComments[index] || []), commentInput];
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
      } else if (event.key === "ArrowLeft") {
        goToPrevImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
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
      setLikes((prevLikes) => [...prevLikes, 0]);
      setComments((prevComments) => [...prevComments, []]);
      setNewImage(null);
      setNewTitle("");
      setNewDescription("");
    }
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
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
          className={`gallery01 ${selectedImageIndex !== null ? "blur" : ""}`}
        >
          <h2>Galería de Publicaciones</h2>
          <div className="gallery-container">
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
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={closeModal}>
                &times;
              </button>
              <div className="modal-container">
                <div className="column1">
                  <button className="nav-button" onClick={goToPrevImage}>
                    &lt;
                  </button>
                </div>
                <div className="column">
                  <img
                    className="modal-image"
                    src={images[selectedImageIndex].src}
                    alt="Imagen seleccionada"
                  />
                  <div className="modal-info">
                    <h3>{images[selectedImageIndex].title}</h3>
                    <p>{images[selectedImageIndex].description}</p>
                  </div>
                </div>
                <div className="column">
                  <form
                    onSubmit={(e) => handleCommentSubmit(e, selectedImageIndex)}
                  >
                    <input
                      type="text"
                      name="comment"
                      placeholder="Escribe un comentario..."
                      required
                    />
                    <button type="submit">Comentar</button>
                  </form>
                  <div className="comments">
                    {comments[selectedImageIndex]?.map((comment, idx) => (
                      <div key={idx} className="chat-bubble">
                        {comment}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="column1">
                  <button className="nav-button" onClick={goToNextImage}>
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <section className="new-image-section">
          <h2>Agregar Nueva Imagen</h2>
          <form onSubmit={handleNewImageSubmit}>
            <input
              type="file"
              accept="image/*"
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
            <button type="submit">Agregar Imagen</button>
          </form>
        </section>
      </main>
      <footer>
        <p>Derechos reservados &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;
