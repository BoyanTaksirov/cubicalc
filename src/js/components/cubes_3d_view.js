var THREE = require('three');
const $ = require("jquery");

const remToPx = require("../utils/utils").remToPx;
const getCSSRuleByName = require("../utils/utils").getCSSRuleByName;

const CUBES_FADE_IN = 1;
const CUBES_FADE_OUT = 2;
const CUBES_NORMAL = 3;
const SCALE_STEP = 0.05;
const ROTATION_STEP = 0.005;
const BOUNDING_SIZE = 1.1;
const SCALE_SIZE = 0.9;

module.exports = class Cubes3D
{
    constructor(parentContainer)
    {
        this.parentContainer = parentContainer;

        this.cubes = [];

        this.viewInfo = $("<div/>").addClass("tableNameLabel");
        this.viewInfo.text("3D View");

        this.canvasContainer = $("<div/>", { id: "canvasContainerID" }).addClass("viewTableContainer");
        this.canvas3D = $("<canvas/>", { id: "canvas3D" }).addClass("canvas3DClass");

        this.canvasContainer.append(this.viewInfo);
        this.canvasContainer.append(this.canvas3D);

        this.addToContainer(this.parentContainer);

        this.cubesData;

        this.cubesState;

        this.animateHandler;

        this.set3DScene();
    }

    set3DScene()
    {
        var canvasCSSWidth = getCSSRuleByName(".canvas3DClass", "width");
        var canvasCSSHeight = getCSSRuleByName(".canvas3DClass", "height");

        var canvasWidth = remToPx(canvasCSSWidth);
        var canvasHeight = remToPx(canvasCSSHeight);

        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(75, canvasWidth/canvasHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas3D[0]});

        this.renderer.setSize(canvasWidth, canvasHeight);
        this.renderer.setClearColor(0x171c19, 1);

        this.geometry = new THREE.BoxGeometry(BOUNDING_SIZE, BOUNDING_SIZE, BOUNDING_SIZE);
        //this.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        this.material = new THREE.MeshNormalMaterial();

        this.material2 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.material2.transparent = true;
        this.material2.opacity = 0;

        this.light = new THREE.PointLight(0xffffff);
        this.light.position.set(100, 200, 100);
        this.scene.add(this.light);

        this.cubeContainer = new THREE.Mesh(this.geometry, this.material2);
        //this.cubeContainer.visible = false;
        this.scene.add(this.cubeContainer);

        this.camera.position.x = 4;
        this.camera.position.y = 4;
        this.camera.position.z = 4;

        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    animate()
    {
        this.cubeContainer.rotation.x += ROTATION_STEP;
        this.cubeContainer.rotation.y += ROTATION_STEP;

        if (this.cubesState === CUBES_FADE_IN)
        {
            this.growCubes();
        }
        else if (this.cubesState === CUBES_FADE_OUT)
        {
            this.decreaseCubes();
        }

        this.renderer.render(this.scene, this.camera);
    };

    growCubes()
    {
        var scaleFactor = this.cubes[0].scale.x + SCALE_STEP;
        if (scaleFactor >= SCALE_SIZE)
        {
            this.cubesState = CUBES_NORMAL;
            scaleFactor = SCALE_SIZE;
        }
        for (var i = 0; i < this.cubes.length; i++)
        {
            this.cubes[i].scale.x = scaleFactor;
            this.cubes[i].scale.y = scaleFactor;
            this.cubes[i].scale.z = scaleFactor;
        }
    }

    decreaseCubes()
    {
        var scaleFactor = this.cubes[0].scale.x - SCALE_STEP;
        if (scaleFactor < 0)
        {
            this.cubesState = CUBES_NORMAL;
            this.createCubes();
            return;
        }
        for (var i = 0; i < this.cubes.length; i++)
        {
            this.cubes[i].scale.x = scaleFactor;
            this.cubes[i].scale.y = scaleFactor;
            this.cubes[i].scale.z = scaleFactor;
        }
    }

    startSwitchCubes(cubesData)
    {
        this.cubesData = cubesData;
        if(this.cubes.length > 0)
        {
            this.initiateCubesFadeOut(cubesData);
        }
        else
        {
            this.createCubes();
        }
    }

    initiateCubesFadeOut()
    {      
        this.cubesState = CUBES_FADE_OUT;
    }

    createCubes()
    {
        this.removeCubes();

        for (var d1 = 0; d1 < this.cubesData.length; d1++)
        {
            for (var d2 = 0; d2 < this.cubesData[d1].length; d2++)
            {
                for (var d3 = 0; d3 < this.cubesData[d1][d2].length; d3++)
                {
                    if (this.cubesData[d1][d2][d3])
                    {
                        var d1Coord = (d1 - this.cubesData.length / 2)*BOUNDING_SIZE;
                        var d2Coord = (d2 - this.cubesData[d1].length / 2)*BOUNDING_SIZE;
                        var d3Coord = (d3 - this.cubesData[d1][d2].length / 2)*BOUNDING_SIZE;
                        this.createCube(d1Coord, d2Coord, d3Coord);
                    }
                }
            }
        }

        this.cubesState = CUBES_FADE_IN;
        this.animateHandler = setInterval(this.animate.bind(this), 20);
    }

    createCube(xPos, yPos, zPos)
    {
        var cube = new THREE.Mesh(this.geometry, this.material);
        this.cubes.push(cube);
        this.cubeContainer.add(cube);
        cube.scale.set(0, 0, 0);
        cube.position.set(xPos, yPos, zPos);
    }

    removeCubes()
    {
        if (this.animateHandler)
        {
            clearInterval(this.animateHandler);
        }

        for (var i = 0; i < this.cubes.length; i++)
        {
            this.cubeContainer.remove(this.cubes[i]);
        }

        this.cubes = [];
    }

    clear()
    {
        this.removeCubes();
        this.scene.remove(this.cubeContainer);
        this.scene.dispose();
        this.canvasContainer.empty();
    }

    addToContainer(parentContainer)
    {
        parentContainer.append(this.canvasContainer);
    }
}