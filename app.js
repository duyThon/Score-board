const { useState, useEffect, useRef } = React;

const { Grid, Button, Typography, Stack, TextField } = MaterialUI;

    const App = () => {
      return (
        <>
          <Remote/>
        </>
      )
    }

    const Timer = ({ onPause }) => {
      const [inputValue, setInputValue] = useState('');
      const [time, setTime] = useState(0);
      const [isRunning, setIsRunning] = useState(false);
      const intervalRef = useRef(null);

      useEffect(() => {
        if (isRunning) {
          intervalRef.current = setInterval(() => {
            setTime((prev) => {
              if (prev <= 0) {
                clearInterval(intervalRef.current);
                setIsRunning(false);
                onPause(); // Notify ShotClock to pause
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
      }, [isRunning]);

      const handleInput = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setInputValue(value);
        const seconds = parseInt(value.slice(-2), 10) || 0;
        const minutes = parseInt(value.slice(0, -2), 10) || 0;
        setTime(minutes * 60 + seconds);
      };

      const handleTimerClick = () => {
        if (time > 0 && isRunning) {
          setIsRunning(false);
          onPause();
        } else if (time > 0 && !isRunning) {
          setIsRunning(true);
        }
      }

      return (
        <div style={{ textAlign: "center"}}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInput}
            placeholder="Nhập thời gian vào đây này"
            style={{
              fontSize: "40px",
              textAlign: "center",
              margin: "20px 50px 0",
              width: "600px",
            }}
          />
          <div onClick={handleTimerClick} className="text" style={{width: "420px", fontSize: "150px", margin: "auto", marginTop: "-15px", cursor: "pointer"}}>
            {String(Math.floor(time / 60)).padStart(2, '0')}:
            {String(time % 60).padStart(2, '0')}
          </div>
        </div>
      );
    };

    // ShotClock Component
    const ShotClock = ({ isCountdownRunning }) => {
      const [time, setTime] = useState(24); // Default shot clock time
      const [isRunning, setIsRunning] = useState(false);

      useEffect(() => {
        if (!isCountdownRunning) {
          setIsRunning(false); // Pause when Countdown stops
        }
      }, [isCountdownRunning]);

      useEffect(() => {
        let interval = null;
        if (isRunning) {
          interval = setInterval(() => {
            setTime((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                setIsRunning(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [isRunning]);

      const handleClockClick = () => {
        if (time > 0) setIsRunning((prev) => !prev); // Toggle running state
      };

      const handleSwitch = () => {
        setIsRunning(false);
        setTime((prev) => (prev === 24 ? 14 : 24));
      };

      return (
        <div style={{ textAlign: "center", marginTop: "-20px" }}>
            <h1 onClick={handleClockClick} className="text twenty-four" style={{
              cursor: "pointer",
              width: "180px",
              textAlign: "center",
              margin: "auto",
              color: time <= 5 ? "red" : "white",
            }}>
              {time}
            </h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSwitch}
            style={{
              position: "absolute",
              top: "236px",
              right: "562px"
            }}
          >
            24s/14s
          </Button>
        </div>
      );
    };

    const UploadImageButton = () => {
      const [image, setImage] = useState(null);

      const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImage(URL.createObjectURL(file)); 
        }
      };

      return (
        <div style={{ textAlign: "center", padding: "40px"}}>
            <h1 className="text"> 
              Logo giải
            </h1>
          <input
            accept="image/*"
            type="file"
            id="upload-button"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <label htmlFor="upload-button">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                textTransform: "none",
              }}
            >
              Upload Image
            </Button>
          </label>
          {image && (
            <div style={{ marginTop: "20px" }}>
              <img
                src={image}
                alt="Uploaded Preview"
                style={{
                  marginTop: "10px",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}
        </div>
      );
    };

    const ScoreAndFault = () => {
      const [teamAScore, setTeamAScore] = useState(0);
      const [teamBScore, setTeamBScore] = useState(0);
      const [teamAFault, setTeamAFault] = useState(0);
      const [teamBFault, setTeamBFault] = useState(0);
      const [editingTeam, setEditingTeam] = useState(null);
      const [tempScore, setTempScore] = useState("");

      const handleScoreClick = (team) => {
        setEditingTeam(team);
        setTempScore(team === "A" ? teamAScore : teamBScore);
      };

      const handleFault = (team) => {
        switch(team) {
          case "A":
            if(teamAFault > 9) {
              setTeamAFault((prev) => prev = 0)
            } else {
              setTeamAFault((prev) => prev + 1)
            }
            break;

          case "B":
            if(teamBFault > 9) {
              setTeamBFault((prev) => prev = 0)
            } else {
              setTeamBFault((prev) => prev + 1)
            }
            break;
        }
      }

      const handleScoreSave = () => {
        const newScore = parseInt(tempScore, 10);
        if (!isNaN(newScore) && newScore >= 0) {
          if (editingTeam === "A") setTeamAScore(newScore);
          if (editingTeam === "B") setTeamBScore(newScore);
        }
        setEditingTeam(null);
      };

      const handleIncrement = (team, increment) => {
        if (team === "A") setTeamAScore((prev) => prev + increment);
        if (team === "B") setTeamBScore((prev) => prev + increment);
      };
      return (
        <>
          <Grid item md={4}>
            {editingTeam === "A" ? (
              <TextField
                value={tempScore}
                onChange={(e) => setTempScore(e.target.value.replace(/\D/g, ""))}
                onBlur={handleScoreSave}
                autoFocus
                fullWidth
                inputProps={{ style: { fontSize: "36px", textAlign: "center" } }}
              />
            ) : (
              <h1
                className="text score"
                style={{
                  fontSize: "160px",
                  cursor: "pointer",
                  width: "200px",
                  margin: "auto",
                  marginTop: "20px"
                }}
                onClick={() => handleScoreClick("A")}
              >
                {teamAScore.toString().padStart(2, '0')}
              </h1>
            )}
            <Stack direction="row" spacing={2} justifyContent="center" marginTop="10px">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleIncrement("A", 1)}
              >
                +1
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleIncrement("A", 2)}
              >
                +2
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleIncrement("A", 3)}
              >
                +3
              </Button>
            </Stack>
          </Grid>

          <Grid item md={2}>
            <div className="consult-fault">
              <div style={{marginTop: "76px"}} className="fault">
                <div className="text">LỖI</div>
                <div style={{cursor: "pointer"}} className="text fault-numb" onClick={() => handleFault("A")}>{teamAFault}</div>
              </div>
            </div>
          </Grid>
          <Grid item md={2}>
            <div className="consult-fault">
              <div style={{marginTop: "76px"}} className="fault">
                <div className="text">LỖI</div>
                <div style={{cursor: "pointer"}} className="text fault-numb" onClick={() => handleFault("B")}>{teamBFault}</div>
              </div>
            </div>
          </Grid>
          <Grid item md={4}>
            {true ? (
              <TextField
                value={tempScore}
                onChange={(e) => setTempScore(e.target.value.replace(/\D/g, ""))}
                onBlur={handleScoreSave}
                autoFocus
                // fullWidth
                style={{
                  height: "200px",
                  width: "200px"
                }}
                inputProps={{ style: { fontSize: "160px", textAlign: "center" }, color: "white" }}
              />
            ) : (
              false
              // <h1
              //   className="text score"
              //   style={{
              //     fontSize: "160px",
              //     cursor: "pointer",
              //     width: "200px",
              //     margin: "auto",
              //     marginTop: "20px"
              //   }}
              //   onClick={() => handleScoreClick("B")}
              // >
              //   {teamBScore.toString().padStart(2, '0')}
              // </h1>
            )}
            <Stack direction="row" spacing={2} justifyContent="center" marginTop="10px">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleIncrement("B", 1)}
              >
                +1
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleIncrement("B", 2)}
              >
                +2
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleIncrement("B", 3)}
              >
                +3
              </Button>
            </Stack>
          </Grid>
        </>
      )
    }

    const Period = () => {
      const [period, setPeriod] = useState(1)

      const handlePeriod = () => {
        if(period < 4) {
          setPeriod((pre) => pre + 1)
        } else {
          setPeriod((pre) => pre = 1)
        }
      } 

      return (
        <div className="period" style={{
          bottom: "284px",
          left: "670px",
          width: "200px",
          cursor: "pointer"
        }}>
          <h1 className="text" onClick={handlePeriod}>HIỆP <span>{period}</span></h1>
        </div>
      )
    }

    const Possession = () => {

    }

    const Remote = () => {
      const [isCountdownRunning, setIsCountdownRunning] = useState(true);

      const handleCountdownPause = () => {
        setIsCountdownRunning(false); // Notify ShotClock to stop
      };
      return (
        <>
          <Grid container spacing={0.5}>
            <Grid item md={3}></Grid>

            <Grid item md={6}>
              <Timer onPause={handleCountdownPause}/>
            </Grid>
            <Grid item md={3}>
              <UploadImageButton/>
            </Grid>
          </Grid>
          <Grid container spacing={0.5}>
            <Grid item md={3}>
              
            </Grid>
            <Grid item md={6}>
              <ShotClock isCountdownRunning={isCountdownRunning}/>
            </Grid>
            <Grid item md={3}>
              
            </Grid>
          </Grid>

          <Grid container spacing={0.5}>
            <ScoreAndFault/>
          </Grid>

          <Period/>
          {/* <Possession/> */}
        </>
      )
    }

    const Scoreboard = () => {
      return (
        <div className="container">
          <Grid container spacing={0.5}>
            <Grid item md={3}>
            </Grid>
            <Grid item md={6}>
              <h1 className="text fulltime">08:14</h1>
            </Grid>
            <Grid item md={3}>
              <div className="logo">
                <img src="./assets/logo-s-league.png"/>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={0.5}>
            <Grid item md={3}>
              <img className="teams-logo" src="./assets/teams-logo/jk.png"/>
            </Grid>
            <Grid item md={2}>
            </Grid>
            <Grid item md={2}>
                <h1 className="text twenty-four">15</h1>
            </Grid>
            <Grid item md={2}>
            </Grid>
            <Grid item md={3}>
              <img className="teams-logo" src="./assets/teams-logo/ps.png"/>
            </Grid>
          </Grid>

          <Grid container spacing={0.5}>
            <Grid item md={4}>
              <h1 className="text score ">72</h1>
            </Grid>
            <Grid item md={2}>
              <div className="consult-fault">
                <div className="fault">
                  <div className="text">LỖI</div>
                  <div className="text fault-numb">5</div>
                </div>
                <div className="consult">
                  <img src="./assets/icons/full-ball.png"/>
                  <img src="./assets/icons/empty-ball.png"/>
                  <img src="./assets/icons/empty-ball.png"/>
                </div>
              </div>
            </Grid>
            <Grid item md={2}>
              <div className="consult-fault">
                <div className="fault">
                  <div className="text">LỖI</div>
                  <div className="text fault-numb">2</div>
                </div>
                <div className="consult">
                  <img src="./assets/icons/full-ball.png"/>
                  <img src="./assets/icons/full-ball.png"/>
                  <img src="./assets/icons/empty-ball.png"/>
                </div>
              </div>
            </Grid>
            <Grid item md={4}>
              <h1 className="text score ">50</h1>
            </Grid>
          </Grid>

          <div className="possession">
            <Grid container spacing={3}>
              <Grid item md={4}>
                <div className="left">
                  <img className="triangle" src="./assets/icons/triangle.png"/>
                </div>
              </Grid>
              <Grid item md={4}></Grid>
              <Grid item md={4}>
                <img className="triangle right" src="./assets/icons/triangle.png"/>
              </Grid>
            </Grid>
          </div>
          <div className="teams-name">
            <div className="left-team">
              <span className="text">
                <h1>passion</h1>
              </span>
            </div>
            <div className="right-team">
              <span className="text">
                <h1>dragon lord</h1>
              </span>
            </div>
          </div>
          <div className="period">
            <h1 className="text">HIỆP <span>1</span></h1>
          </div>
        </div>
      );
    };

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);