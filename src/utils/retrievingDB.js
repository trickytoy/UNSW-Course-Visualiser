export default function retrievingDB(courseData) {
    const nodes = [];
    const edges = [];

    // A set to track unique node IDs to avoid duplicates
    const nodeSet = new Set();

    courseData.forEach(({ node1, relationship, node2 }) => {
        console.log({ node1, relationship, node2 })
        // Add node1 if it doesn't already exist
        if (!nodeSet.has(node1.id)) {
        if (node1.id === 0 || node1.id === 1 || node1.id === 2 || node1.id === 3 || node1.id === 4 || node1.id === 5 || node1.id === 6 ) {
            nodes.push({
                id: node1.id,
                label: node1.name,
                title: node1.name,
            });
        } else {
            nodes.push({
                id: node1.id,
                label: node1.courseCode,
                title: node1.courseTitle,
                Description: node1.courseDesc,
                Condition: node1.courseCondition
            })
        }
        nodeSet.add(node1.id);
        }

        // Add node2 if it doesn't already exist
        if (!nodeSet.has(node2.id)) {
            if (node2.id === 0 || node2.id === 1 || node2.id === 2 || node2.id === 3 || node2.id === 4 || node2.id === 5 || node2.id === 6 ) {
                nodes.push({
                    id: node2.id,
                    label: node2.name,
                    title: node2.name,
                });
            } else {
                nodes.push({
                    id: node2.id,
                    label: node2.courseCode,
                    title: node2.courseTitle,
                    Description: node2.courseDesc,
                    Condition: node2.courseCondition
                })
            }
        nodeSet.add(node2.id);
        }

        // Add the edge
        edges.push({
        from: node1.id,
        to: node2.id,
        });
    });

    console.log(nodes, edges)
    return { nodes, edges };
};