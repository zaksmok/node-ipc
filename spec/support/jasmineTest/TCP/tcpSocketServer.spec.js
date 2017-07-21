/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

describe('TCP Socket verification of server',
    function TCPSocketSpec(){
      let clientID='';
      it(
          'Verify TCP server detects only 1 client out of 2 clients.',
          function testIt(done){
              ipc.config.id ='testWorld';
              ipc.config.retry = 1000;

              let clientCounter=0;
              ipc.config.maxConnections=1;
              ipc.config.networkPort=8500;

              ipc.serveNet(
                  function serverStarted(){
                    ipc.server.on(
                        'connect',
                        function connected(socket){
                            clientCounter++;
                            setTimeout(
                              function(){
                                ipc.server.emit(socket,'howdy');
                              }.bind(this),
                              ipc.config.retry+ipc.config.retry*2
                            );
                        }
                    );

                    ipc.server.on(
                        'hooray',
                        function gotMessage(data,socket){
                          ipc.server.off(
                            'hooray','*'
                          );
                          expect(socket).toBeDefined();
                          expect(clientCounter).toBe(ipc.config.maxConnections);
                          done();
                        }
                    );
                  }
              );

              ipc.server.start();
          }
      );

      it(
          'Verify TCP server broadcasts and receives message.',
          function testIt(done){
            ipc.server.on(
                'hooray',
                function gotMessage(data,socket){
                  ipc.server.off(
                    'hooray','*'
                  );
                  clientID=socket.id;
                  expect(socket.id).toBeDefined();
                  expect(socket).toBeDefined();
                  done();
                }
            );

            ipc.server.broadcast('howdy');
          }
      );

      it(
          'Verify TCP server broadcasts to a group and receives message.',
          function testIt(done){
            ipc.server.on(
                'hooray',
                function gotMessage(data,socket){
                  expect(socket).toBeDefined();
                  ipc.server.stop();
                  done();
                }
            );
            
            ipc.server.of[clientID].broadcast('howdy');
          }
      );
    }
);
