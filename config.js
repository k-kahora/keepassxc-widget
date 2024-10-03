
const PasswordEntry = entry => Widget.Button({
    on_clicked: () => {
	print(entry)
    },
    attribute: { entry },
    child: Widget.Label({
	        class_name: "title",
                label: entry,
                xalign: 0,
                vpack: "center",
                truncate: "end",
    })
    
})


const PasswordLauncher = ({ width = 500, height = 500, spacing = 12 }) => {
    
// const proc = Utils.subprocess(
//     // command to run, in an array just like execAsync
//     ['bash', '-c', './script.sh'],

//     // callback when the program outputs something to stdout
//     (output) => print(output),

//     // callback on error
//     (err) => logError(err),

//     // optional widget parameter
//     // if the widget is destroyed the subprocess is forced to quit
//     widget,
// )
    
    const entrys = Utils.exec('bash -c ./script.sh').split('\n').map(PasswordEntry) // returns string
    
    const list = Widget.Box({
        vertical: true,
        children: entrys,
    })


    const entry = Widget.Entry({

	hexpand: true,
	css: `margin-bottom: ${spacing}px;`,
        on_change: ({ text }) => entrys.forEach(item => {
            item.visible = item.attribute.entry.match(text ?? "")
        }),
        on_accept: () => {
            // make sure we only consider visible (searched for) applications
	    const results = entrys.filter((item) => item.visible);
            if (results[0]) {
                // App.toggleWindow(WINDOW_NAME)
                // results[0].attribute.app.launch()
		let selected = results[0].attribute.entry
		// Copies entry to clipboard
		// This is blocking so when this runs the gui no longer runs
		print(['bash', '-c', 'secret-tool lookup xc 1 | keepassxc-cli clip ~/Documents/PassDatabase/Passwords.kdbx "${selected}"' ])
		Utils.execAsync(['bash', '-c', `secret-tool lookup xc 1 | keepassxc-cli clip ~/Documents/PassDatabase/Passwords.kdbx "${selected}"` ]).then(out => print(out)).catch(err => print(err))
            }
        },
    })

    return Widget.Box({
        vertical: true,
        css: `margin: ${spacing * 2}px;`,
        children: [
            entry,

            // wrap the list in a scrollable
            // Widget.Scrollable({
            //     hscroll: "never",
            //     css: `min-width: ${width}px;`
            //         + `min-height: ${height}px;`,
            //     child: list,
            // }),
            Widget.Scrollable({
                hscroll: "never",
                css: `min-width: ${width}px;`
                    + `min-height: ${height}px;`,
                child: list,
            }),
        ],
        // setup: self => self.hook(App, (_, windowName, visible) => {
        //     if (windowName !== WINDOW_NAME)
        //         return

        //     // when the applauncher shows up
        //     if (visible) {
        //         repopulate()
        //         entry.text = ""
        //         entry.grab_focus()
        //     }
        // }),
    })
}



const window = Widget.Window({
    name: 'pass-launcher',
    exclusivity: 'normal',
    keymode: 'on-demand',
    layer: 'top',
    margins: [0, 6],
    monitor: 1,
    child: PasswordLauncher({
        width: 500,
        height: 500,
        spacing: 12,
    }),
})


App.config({
    style: "./style.css",
    windows: [
	window

        // you can call it, for each monitor
        // Bar(0),
        // Bar(1)
    ],
})
