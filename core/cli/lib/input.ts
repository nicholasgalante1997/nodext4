type CommandResult = {
    shouldEnd: boolean;
};

export function handleInput(input: string): CommandResult {
    if (input.startsWith('.')) {
        return handleDotCommand(input);
    }

    return handleUnknownCommand();
}

function handleDotCommand(input: string): CommandResult {
    switch(input) {
        case '.clear': return handleClearCommand();
        case '.help': return handleHelpCommand();
        case '.exit':
        case '.quit':
        case '.q': return handleQuitCommand();
        default: return handleUnknownCommand();
    }
}

function handleHelpCommand(): CommandResult {
    console.log('todo: help command');
    return {
        shouldEnd: false
    };
}

function handleQuitCommand(): CommandResult {
    return {
        shouldEnd: true
    };
}

function handleUnknownCommand(): CommandResult {
    console.log('Unknown command. Type .help for a list of commands.');
    return {
        shouldEnd: false
    };
}

function handleClearCommand(): CommandResult {
    console.clear();
    return {
        shouldEnd: false
    };
}
