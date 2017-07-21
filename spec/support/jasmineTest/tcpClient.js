'use strict';

const ipc=require('../../../node-ipc');
const process=require('process');
const dieAfter=30000;

//die after 60 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'tcpClient';
ipc.config.retry= 600;
ipc.config.silent=true;
ipc.config.networkPort=8500;

const secondIPC=new ipc.IPC;
secondIPC.config.id = 'tcpClient2';
secondIPC.config.retry= ipc.config.retry;
secondIPC.config.silent=ipc.config.silent;
secondIPC.config.networkPort=ipc.config.networkPort;

ipc.connectToNet(
  'testserver',
  function(){
    ipc.of.testserver.on(
        'howdy',
        function(data){
            ipc.of.testserver.emit('hooray');
        }
    );
  }
);

secondIPC.connectToNet(
  'testserver',
  function(){
    secondIPC.of.testserver.on(
        'howdy',
        function(data){
            secondIPC.of.testserver.emit('hooray');
        }
    );
  }
);
