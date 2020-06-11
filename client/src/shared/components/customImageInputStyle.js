const customImageInputStyle = theme => ({
    hidden: { display: "none" },

    container: {
        margin: "auto",
        marginBottom: "30px"
    },
    title: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        padding: theme.spacing(2)
    },
    errorMsg: {
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        padding: theme.spacing(2)
    },
    bigAvatar: {
        margin: "auto",
        width: 140,
        height: 140,
        // borderColor: theme.palette.primary.light,
        borderStyle: "solid",
        borderSize: "1px",
        cursor: "pointer"
    },
    avatarThumb: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    primaryBack: {
        background: "#FFF"
    },
    whiteBack: {
        background: "white"
    },

    errorBack: { background: theme.palette.error.main }
});
export default customImageInputStyle;
