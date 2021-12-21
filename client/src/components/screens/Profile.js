import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import Not from "./Not";
import M from "materialize-css";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [myName, setMyName] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/mypost", {
      headers: {
        Authorization: "Sammi " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result.myPost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "sammiGram");
      data.append("cloud_name", "dtabxocmw");
      fetch("https://api.cloudinary.com/v1_1/dtabxocmw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Sammi " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  const editProfile = () => {
    if (myName) {
      fetch("/editname", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Sammi " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          myName,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, name: data.name })
          );
          dispatch({ type: "EDITPROFILE", payload: data.name });
          M.toast({
            html: "Your Profile was changed successfully!!",
            classes: "#0d47a1 blue darken-4",
          });
        });
    }
    setIsEdit(false);
  };

  return (
    <div className="profile">
      <div className="profileMain">
        <div>
          <div class="containers">
            <img
              src={state ? state.pic : "Loading"}
              alt="Avatar"
              class="profileImg"
            />
            <div class="middles">
              <button
                onClick={() => setIsOpenModal(true)}
                className="btn #0d47a1 blue darken-4"
              >
                <i className="material-icons">add_a_photo</i>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="profileName">
            <h4>{state ? state.name : "loading"}</h4>
            <button
              onClick={() => setIsEdit(true)}
              className="btn #0d47a1 blue darken-4"
            >
              <i className="material-icons">settings</i>
            </button>
          </div>
          <div className="infoProfile">
            <p>{profile.length} posts</p>
            <p>{state ? state.followers.length : "0"} followers</p>
            <p>{state ? state.following.length : "0"} following</p>
          </div>
          <Link to="/myfollowerpost">
            <button
              style={{ marginTop: 10 }}
              className="btn #0d47a1 blue darken-4"
            >
              Show My Following Users Posts
            </button>
          </Link>
        </div>
      </div>
      {!profile.length ? (
        <Not />
      ) : (
        profile.map((item) => {
          return (
            <div className="gallery">
              <div key={item._id} className="img-item">
                <img src={item.photo} alt={item._id} />
              </div>
            </div>
          );
        })
      )}
      {isOpenModal ? (
        <div className="modalS" onClick={() => setIsOpenModal(false)}>
          <div className="modalS__content" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h4>Add Your Accaunt Photo</h4>
              <i
                style={{ cursor: "pointer", color: "#0d47a1" }}
                onClick={() => setIsOpenModal(false)}
                className="small material-icons "
              >
                close
              </i>
            </div>
            <div className="modalConten">
              <div class="file-field input-field">
                <div class="btn #0d47a1 blue darken-4">
                  <span>
                    <i className="material-icons">add_a_photo</i>
                  </span>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                </div>
                <div class="file-path-wrapper">
                  <input
                    class="file-path validate"
                    type="text"
                    placeholder="You Photo"
                  />
                </div>
              </div>
            </div>
            <div className="modalFooter">
              <button
                className="btn #0d47a1 blue darken-4"
                onClick={() => setIsOpenModal(false)}
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isEdit ? (
        <div className="modalS" onClick={() => setIsEdit(false)}>
          <div className="modalS__content" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h4>Change Accaunt Profile</h4>
              <i
                style={{ cursor: "pointer", color: "#0d47a1" }}
                onClick={() => setIsEdit(false)}
                className="small material-icons "
              >
                close
              </i>
            </div>
            <div className="modalConten">
              <div class="file-field input-field">
                <div class="btn #0d47a1 blue darken-4">
                  <span>
                    <i className="material-icons">add_a_photo</i>
                  </span>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                </div>
                <div class="file-path-wrapper">
                  <input
                    class="file-path validate"
                    type="text"
                    placeholder="You Photo"
                  />
                </div>
              </div>
              <div class="input-field col s6">
                <i class="material-icons prefix" style={{ color: "#0d47a1" }}>
                  account_circle
                </i>
                <input
                  id="icon_prefix"
                  onChange={(e) => setMyName(e.target.value)}
                  type="text"
                  class="validate"
                />
                <label for="icon_prefix">First Name</label>
              </div>
            </div>
            <div className="modalFooter">
              <button
                className="btn #0d47a1 blue darken-4"
                onClick={() => editProfile()}
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
