var OPTIONS = {
    settings: {
        from: 1,
        to: 10,
        step: 1,
        smooth: false,
        limits: true,
        round: 0,
        format: { format: "#,##0.##" },
        value: "5;7",
        dimension: ""
    },

    className: "jslider",
    selector: ".jslider-",

    template: tmpl(
            '<span class="<%=className%>">' +
                '<table><tr><td>' +
                '<div class="<%=className%>-bg">' +
                '<i class="l"></i><i class="f"></i><i class="r"></i>' +
                '<i class="v"></i>' +
                '</div>' +
                '<div class="<%=className%>-pointer"></div>' +
                '<div class="<%=className%>-pointer <%=className%>-pointer-to"></div>' +
                '<div class="<%=className%>-label"><span><%=settings.from%></span></div>' +
                '<div class="<%=className%>-label <%=className%>-label-to"><span><%=settings.to%></span><%=settings.dimension%></div>' +
                '<div class="<%=className%>-value"><span></span><%=settings.dimension%></div>' +
                '<div class="<%=className%>-value <%=className%>-value-to"><span></span><%=settings.dimension%></div>' +
                '<div class="<%=className%>-scale"><%=scale%></div>' +
                '</td></tr></table>' +
                '</span>'
        )
};