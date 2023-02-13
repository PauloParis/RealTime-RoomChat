const users = [];

// unir usuarios al chat
export const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user
}

// se obtienen los usuarios conectados
export const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

// se filtra al usuario que se desconecta del chat
export const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) return users.splice(index, 1)[0];
}

// se filtra a los usuarios conectados de acuerdo a la sala  
export const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}