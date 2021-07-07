      import React, {Component} from 'react';
      import './App.css';

      const { Device } = require('twilio-client');

      class App extends Component {
        constructor(props) {
          super(props)

          this.state={
            identity: '',
            status: '',
            ready: false
          }

          this.onChangeUpdateState = this.onChangeUpdateState.bind(this);
          this.setup = this.setup.bind(this);
          this.connect = this.connect.bind(this);
          this.disconnect = this.disconnect.bind(this);
        }

        componentDidMount() {
          const device = new Device();

          this.setState({
            device: device
          });

          device.on('incoming', connection => {
        // immediately accepts incoming connection
        connection.accept();

            this.setState({
              status: connection.status()
            });
          });

          device.on('ready', device => {
            this.setState({
              status: "device ready",
              ready: true
            });
          });

          device.on('connect', connection => {
            this.setState({
              status: connection.status()
            });
          });

          device.on('disconnect', connection => {
            this.setState({
              status: connection.status()
            });
          });
        }

        // This method sets the identity of the Twilio Device
        // that your device is going to connect to. This
        // example uses hardcoded values so that only devices
        // with the identities friend1 and friend2 can connect.
        // In a production application, this would have to be
        // handled in a much different way. Most likely, the
        // app would have users who are authenticated with a
        // username and password. Their unique username would
        // serve as their device’s identity and they would only
        // be able to connect to device’s owned by users in their
        // friend list.
        connect(){
          const recipient = this.state.identity === 'friend1' ? 'friend2' ? 'friend1';
          this.state.device.connect({recipient:recipient});
        }

        disconnect() {
          this.state.device.disconnectAll();
        }

        setup(event) {
        // prevents form submission and page refresh
        event.preventDefault();

        fetch(`https://walkie-talkie-service-5481-dev.twil.io/token?identity=${this.state.identity}`)
          .then(response => response.json())
          .then(data => {
            this.state.device.setup(data.accessToken);
            this.state.device.audio.incoming(false);
            this.state.device.audio.outgoing(false);
            this.state.device.audio.disconnect(false);
          })
          .catch(err => console.log(err))
        }

        onChangeUpdateState(event) {
          this.setState({
            identity: event.target.value
          });
        }

        render() {
          return (
            <div className="App">
              {
                this.state.ready
                ? <button onMouseDown={this.connect}
                          onMouseUp={this.disconnect}>
                    Press to Talk
                  </button>
                : <div>
                    <p>Enter your name to begin.</p>
                    <form onSubmit={this.setup}>
                      <input
                        value={this.state.identity}
                        onChange={this.onChangeUpdateState}
                        type="text"
                        placeholder="What's your name?"></input>
                      <input type="submit" value="Begin Session"></input>
                    </form>
                  </div>
              } //fake note
              <p>{ this.state.status }</p>
            </div>
          );
        }


      }

      export default App;
